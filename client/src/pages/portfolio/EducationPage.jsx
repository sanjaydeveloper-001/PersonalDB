import PortfolioListPage from '../../components/portfolio/PortfolioListPage'
import { portfolioService } from '../../services/portfolioService'
import { GraduationCap } from 'lucide-react'

const service = {
  getAll: portfolioService.getEducation,
  create: portfolioService.createEducation,
  update: portfolioService.updateEducation,
  delete: portfolioService.deleteEducation,
}

const fields = [
  { name: 'institution', label: 'Institution', required: true },
  { name: 'course', label: 'Course / Degree', required: true },
  { name: 'duration', label: 'Duration', required: true },
  { name: 'cgpa', label: 'CGPA' },
  { name: 'percentage', label: 'Percentage' },
  { name: 'description', label: 'Description', rows: 3 },
]

const EducationPage = () => <PortfolioListPage title="Education" service={service} fields={fields} icon={<GraduationCap/>} />

export default EducationPage
