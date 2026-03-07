import { useState } from 'react'
import styles from './styles'
import Toolbar from './components/Toolbar'
import CommitList from './components/CommitList'
import DetailPane from './components/DetailPane'
import AmendModal from './components/modals/AmendModal'
import UndoModal from './components/modals/UndoModal'
import RewordModal from './components/modals/RewordModal'
import SquashModal from './components/modals/SquashModal'

export default function App() {
  const [repoPath, setRepoPath] = useState('')
  const [branch, setBranch] = useState('')
  const [commits, setCommits] = useState([])
  const [selected, setSelected] = useState(null)
  const [checkedSet, setCheckedSet] = useState(new Set())
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [isDirty, setIsDirty] = useState(false)

  async function handleBrowse() {
    const folder = await window.dialog.openFolder()
    if (!folder) return
    await loadRepo(folder)
  }

  async function loadRepo(path) {
    setError('')
    setSelected(null)
    setCheckedSet(new Set())
    setIsDirty(false)
    const result = await window.git.openRepo(path)
    if (!result.success) {
      setError(result.error)
      setCommits([])
      setBranch('')
      return
    }
    setRepoPath(path)
    setBranch(result.branch)
    const log = await window.git.getCommits(100)
    if (log.success) setCommits(log.commits)
    else setError(log.error)
  }

  async function refreshCommits() {
    const log = await window.git.getCommits(100)
    if (log.success) {
      setCommits(log.commits)
      setSelected(0)
      setCheckedSet(new Set())
      setIsDirty(true)
    }
  }

  function handleToggleCheck(index) {
    setCheckedSet(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleClearChecked() {
    setCheckedSet(new Set())
  }

  function handleForcePushSuccess() {
    setIsDirty(false)
  }

  const selectedCommit = selected !== null ? commits[selected] : null
  const checkedCommits = [...checkedSet]
    .sort((a, b) => a - b)
    .map(i => commits[i])

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <Toolbar
          repoPath={repoPath}
          setRepoPath={setRepoPath}
          branch={branch}
          onBrowse={handleBrowse}
          onOpen={loadRepo}
          isDirty={isDirty}
          onForcePushSuccess={handleForcePushSuccess}
        />

        <div className="main">
          <CommitList
            commits={commits}
            selected={selected}
            onSelect={setSelected}
            checkedSet={checkedSet}
            onToggleCheck={handleToggleCheck}
            error={error}
          />

          <DetailPane
            commit={selectedCommit}
            selectedIndex={selected}
            checkedCount={checkedSet.size}
            checkedCommits={checkedCommits}
            onAction={setModal}
            onClearChecked={handleClearChecked}
          />
        </div>

      </div>

      {modal === 'amend' && selectedCommit && (
        <AmendModal
          commit={selectedCommit}
          onClose={() => setModal(null)}
          onSuccess={async () => { setModal(null); await refreshCommits() }}
        />
      )}

      {modal === 'undo' && selectedCommit && (
        <UndoModal
          commit={selectedCommit}
          onClose={() => setModal(null)}
          onSuccess={async () => { setModal(null); await refreshCommits() }}
        />
      )}

      {modal === 'reword' && selectedCommit && (
        <RewordModal
          commit={selectedCommit}
          onClose={() => setModal(null)}
          onSuccess={async () => { setModal(null); await refreshCommits() }}
        />
      )}

      {modal === 'squash' && checkedCommits.length >= 2 && (
        <SquashModal
          commits={checkedCommits}
          onClose={() => setModal(null)}
          onSuccess={async () => { setModal(null); await refreshCommits() }}
        />
      )}
    </>
  )
}