import axios from 'axios'
import { Repo } from '../store'
import * as L from 'lonna'
import * as M from '../util/maybe'

export type WorkflowRun = {
  name: string
  status: 'in_progress' | 'queued' | 'completed'
  conclusion:
    | 'action_required'
    | 'cancelled'
    | 'failure'
    | 'neutral'
    | 'success'
    | 'skipped'
    | 'stale'
    | 'timed_out'
    | null
  head_branch: string
  repository: {
    full_name: string
  }
  created_at: string
}

const ghClient = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/repos/'
      : 'https://api.github.com/repos/',
})

const constructUrl = (user: string, repo: string) => `${user}/${repo}/actions/runs`

const doRequest = (repo: Repo, maybeToken: M.Maybe<string>) => {
  const headers = M.fold(
    token => ({ authorization: `token ${token}` }),
    () => ({})
  )(maybeToken)

  return ghClient
    .get<{ workflow_runs: WorkflowRun[] }>(constructUrl(repo.user, repo.repo), {
      headers,
    })
    .then(r => r.data.workflow_runs)
}

export const startPoll = (repo: Repo, token: M.Maybe<string>) =>
  L.interval(15000, []).pipe(
    L.flatMapLatest(() =>
      L.fromPromise(
        doRequest(repo, token),
        () => [],
        (x0: any[]) => x0,
        _ => []
      )
    )
  )
