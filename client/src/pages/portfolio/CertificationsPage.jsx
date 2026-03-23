import PortfolioListPage from '../../components/portfolio/PortfolioListPage'
import { portfolioService } from '../../services/portfolioService'
import { Award } from 'lucide-react'

const service = {
  getAll: portfolioService.getCertifications,
  create: portfolioService.createCertification,
  update: portfolioService.updateCertification,
  delete: portfolioService.deleteCertification,
}

const fields = [
  { name: 'name', label: 'Certification Name', required: true },
  { name: 'issuer', label: 'Issuing Organization', required: true },
  { name: 'issueDate', label: 'Issue Date', type: 'date' },
  { name: 'image', label: 'Certificate Image', type: 'file' },
  { name: 'link', label: 'Credential URL', type: 'url' },
]

const CertificationsPage = () => <PortfolioListPage title="Certifications" service={service} fields={fields} icon={<Award/>} />

export default CertificationsPage
