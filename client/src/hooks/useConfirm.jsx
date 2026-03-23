import { useState } from 'react'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({ title: '', message: '', onConfirm: () => {} })

  const confirm = ({ title, message }) => {
    return new Promise((resolve) => {
      setConfig({ title, message, onConfirm: resolve })
      setIsOpen(true)
    })
  }

  const handleConfirm = () => { config.onConfirm(true); setIsOpen(false) }
  const handleCancel = () => { config.onConfirm(false); setIsOpen(false) }

  const ConfirmModal = () => (
    <Modal isOpen={isOpen} onClose={handleCancel} title={config.title}>
      <p className="text-gray-700 dark:text-gray-300">{config.message}</p>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
      </div>
    </Modal>
  )

  return { confirm, ConfirmModal }
}
