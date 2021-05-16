import axios from 'axios'
import { Repo } from '../store'
import * as L from 'lonna'
import * as M from '../util/maybe'

const ghClient = axios.create({
  baseURL: 'https://api.github.com/repos/',
})

const constructUrl = (user: string, repo: string) => `${user}/${repo}/actions/runs`

const doRequest = (repo: Repo, maybeToken: M.Maybe<string>) => {
  const headers = M.fold(
    token => ({ authorization: `token ${token}` }),
    () => ({})
  )(maybeToken)

  return ghClient.get(constructUrl(repo.user, repo.repo), { headers }).then(r => r.data)
}

export const startPoll = (repo: Repo, token: M.Maybe<string>) =>
  L.interval(15000, null).pipe(
    L.flatMapLatest(() =>
      L.fromPromise(
        doRequest(repo, token),
        () => [],
        (x0: any[]) => x0,
        err => null
      )
    )
  )
