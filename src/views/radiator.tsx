import { h } from 'harmaja'
import { startPoll, WorkflowRun } from '../service/github'
import * as L from 'lonna'
import './radiator.css'
import { Maybe } from '../util/maybe'
import { formatDistanceToNow } from 'date-fns'

type Props = {
  user: string
  repo: string
  token: Maybe<string>
}

type RunTag = 'green' | 'white' | 'yellow' | 'red'

const resolveStatusTag = (state: Pick<WorkflowRun, 'status' | 'conclusion'>): RunTag => {
  if (['queued', 'in_progress'].includes(state.status)) return 'yellow'

  if (state.conclusion === 'failure') return 'red'

  if (state.conclusion === 'success') return 'green'

  return 'white'
}

const sortAndSlice = (runs: WorkflowRun[]) =>
  runs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, (window as any).itemCount || 5)

const RadiatorItem = ({ run }: { run: WorkflowRun }) => (
  <div className={`workflow-item ${resolveStatusTag(run)}`}>
    <div className="workflow-item-labels">
      <h2>
        {run.repository.full_name}:{run.head_branch}
      </h2>
      <h4>{run.name}</h4>
      <p>{formatDistanceToNow(new Date(run.created_at))} ago</p>
    </div>
  </div>
)

export const RadiatorView = ({ user, repo, token }: Props) => {
  return (
    <div className="radiator-view">
      {startPoll({ user, repo }, token).pipe(
        L.map(sortAndSlice),
        L.map((workflows: WorkflowRun[]) => workflows.map(r => <RadiatorItem run={r} />)),
        L.toProperty([], L.globalScope)
      )}
    </div>
  )
}
