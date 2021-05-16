import { h } from 'harmaja'
import { startPoll } from '../service/github'
import * as L from 'lonna'
import './radiator.css'
import { Maybe } from '../util/maybe'

type Props = {
  user: string
  repo: string
  token: Maybe<string>
}

export const RadiatorView = ({ user, repo, token }: Props) => {
  return (
    <div className="radiator-view">
      {startPoll({ user, repo }, token).pipe(
        L.map((workflows: any) =>
          workflows.workflow_runs.map((r: any) => (
            <p>
              {r.name} {r.conclusion}
            </p>
          ))
        ),
        L.toProperty([], L.globalScope)
      )}
    </div>
  )
}
