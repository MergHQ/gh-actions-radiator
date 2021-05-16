import { h, Fragment } from 'harmaja'
import { AppState } from '../store'
import './setup.css'
import * as L from 'lonna'
import { some } from '../util/maybe'

type Props = {
  appState: AppState
}

type FormState = {
  user: string
  repo: string
  token: string
}

const formState = L.atom<FormState>({
  user: '',
  repo: '',
  token: '',
})

const submit = (appState: AppState) => () => {
  const formData = formState.get()

  appState.repo.set(
    some({
      repo: formData.repo,
      user: formData.user,
    })
  )

  appState.token.set(some(formData.token))
}

export const SetupView = ({ appState }: Props) => {
  return (
    <div className="setup-view">
      {L.map((state: FormState) => (
        <div className="setup-modal">
          <span>Username</span>
          <input
            onChange={e => formState.set({ ...state, user: e.target.value })}
            value={state.user}
            type="text"
          ></input>
          <span>Repository</span>
          <input
            onChange={e => formState.set({ ...state, repo: e.target.value })}
            value={state.repo}
            type="text"
          ></input>
          <span>Token (for private repos)</span>
          <input
            value={state.token}
            type="text"
            onChange={e => formState.set({ ...state, token: e.target.value })}
          ></input>
          <button onClick={submit(appState)}>Submit!</button>
        </div>
      ))(formState)}
    </div>
  )
}
