import { h } from 'harmaja'
import { AppState, Repo } from './store'
import * as M from './util/maybe'
import { SetupView } from './views/setup'
import * as L from 'lonna'
import './app.css'
import { RadiatorView } from './views/radiator'

type Props = {
  appState: AppState
}

export const App = ({ appState }: Props) => {
  return appState.repo.pipe(
    L.map(
      M.fold(
        ({ repo, user }) => (
          <RadiatorView repo={repo} token={appState.token.get()} user={user} />
        ),
        () => <SetupView appState={appState} />
      )
    )
  )
}
