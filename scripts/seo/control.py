"""Operate one enrolled client's primary GitHub workflow control with existing gh auth."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

from runner_control import WORKFLOW_NAME as WORKFLOW, WORKFLOW_PATH, STARTUP_VARIABLE as VARIABLE


class ControlError(ValueError):
    pass


def gh(args, body=None):
    result=subprocess.run(['gh',*args],input=json.dumps(body) if body is not None else None,
                          text=True,capture_output=True)
    if result.returncode:
        raise ControlError('GitHub control operation failed; primary workflow state must be checked')
    return json.loads(result.stdout) if result.stdout.strip() else None


def api(repository, suffix, method='GET', body=None):
    args=['api','--method',method,'repos/'+repository+suffix]
    if body is not None: args+=['--input','-']
    return gh(args,body)


def bind(policy,client,repository):
    if (policy.get('client')!=client or policy.get('repository')!=repository
            or not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+',repository)):
        raise ControlError('Client/repository does not match the enrolled policy')
    configured=policy.get('publication_control',{})
    if configured.get('primary','github-workflow-state')!='github-workflow-state' or configured.get('workflow',WORKFLOW)!=WORKFLOW:
        raise ControlError('Unsupported client publication control')


def workflow(repository):
    value=api(repository,'/actions/workflows/'+WORKFLOW)
    if not isinstance(value,dict) or value.get('path')!=WORKFLOW_PATH:
        raise ControlError('Client publishing workflow identity mismatch')
    return value


def variable(repository):
    value=api(repository,'/actions/variables/'+VARIABLE)
    if not isinstance(value,dict) or value.get('name')!=VARIABLE or not isinstance(value.get('value'),str):
        raise ControlError('Legacy startup brake could not be read')
    return value['value'].lower()=='true'


def status(policy,client,repository):
    bind(policy,client,repository)
    state=workflow(repository).get('state')
    brake=variable(repository)
    return {'client':client,'repository':repository,'primary_control':'github-workflow-state',
            'workflow_state':state,'startup_brake_enabled':brake,'policy_enabled':policy.get('enabled') is True,
            'mode':'on' if state=='active' and brake and policy.get('enabled') is True else 'off'}


def cancel_nonterminal(repository):
    pages=gh(['api','--paginate','--slurp','repos/'+repository+'/actions/workflows/'+WORKFLOW+'/runs?per_page=100'])
    if not isinstance(pages,list) or any(not isinstance(page,dict) or not isinstance(page.get('workflow_runs'),list) for page in pages):
        raise ControlError('Current workflow runs could not be checked')
    cancelled=[]
    for page in pages:
        for run in page['workflow_runs']:
            if run.get('status')=='completed': continue
            run_id=str(run.get('id',''))
            if not re.fullmatch(r'\d+',run_id): raise ControlError('Invalid current workflow run identity')
            try:
                api(repository,'/actions/runs/'+run_id+'/cancel',method='POST')
                cancelled.append(run_id)
            except ControlError:
                # Finishing between list and cancel is a safe terminal race.
                latest=api(repository,'/actions/runs/'+run_id)
                if not isinstance(latest,dict) or latest.get('status')!='completed': raise
    return cancelled


def change(policy,client,repository,mode):
    bind(policy,client,repository)
    if mode=='status': return status(policy,client,repository)
    if mode not in ['off','on']: raise ControlError('Unsupported control mode')
    if mode=='on' and policy.get('enabled') is not True:
        raise ControlError('Enroll and verify the client policy before enabling its workflow')
    current=status(policy,client,repository)
    if mode=='on' and current['mode']=='on': return {**current,'cancellation_requests':0}
    # Disable first: the fresh runtime gate immediately denies any queued/running
    # job, even if its startup variable snapshot is still true.
    disabled_states={'disabled_manually','disabled_inactivity','disabled_fork'}
    if current['workflow_state']=='active':
        api(repository,'/actions/workflows/'+WORKFLOW+'/disable',method='PUT')
    elif current['workflow_state'] not in disabled_states:
        raise ControlError('Unknown workflow state; no control changes made')
    # GitHub rejects disabling an already disabled workflow. Read its identity
    # and known disabled state again before changing the brake or cancelling.
    if workflow(repository).get('state') not in disabled_states:
        raise ControlError('Workflow is not confirmed disabled; no further control changes made')
    try:
        api(repository,'/actions/variables/'+VARIABLE,method='PATCH',body={'name':VARIABLE,'value':'false'})
    finally:
        cancelled=cancel_nonterminal(repository)
    if mode=='on':
        for run_id in cancelled:
            latest=api(repository,'/actions/runs/'+run_id)
            if not isinstance(latest,dict) or latest.get('status')!='completed':
                raise ControlError('Previous run cancellation is pending; workflow remains Off. Retry On after it completes.')
        api(repository,'/actions/variables/'+VARIABLE,method='PATCH',body={'name':VARIABLE,'value':'true'})
        api(repository,'/actions/workflows/'+WORKFLOW+'/enable',method='PUT')
    confirmed=status(policy,client,repository)
    if confirmed['mode']!=mode:
        raise ControlError('Requested workflow control state was not verified')
    return {**confirmed,'cancellation_requests':len(cancelled)}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--client',required=True)
    parser.add_argument('--repo',required=True)
    parser.add_argument('--policy',type=Path,default=Path('seo/policy.json'))
    parser.add_argument('mode',choices=['off','on','status'])
    args=parser.parse_args()
    try:
        policy=json.loads(args.policy.read_text())
        print(json.dumps(change(policy,args.client,args.repo,args.mode),indent=2))
    except (ControlError,OSError,ValueError) as error:
        print(str(error),file=sys.stderr)
        raise SystemExit(1)


if __name__=='__main__': main()
