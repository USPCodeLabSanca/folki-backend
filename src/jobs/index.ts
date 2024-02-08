import syncClassesJupiterBySubjectWorker from '../subject/jobs/syncClassesJupiterBySubject'
import syncDefaultSubjectsJupiterWorker from '../subject/jobs/syncDefaultSubjectsJupiterByCourse'
import syncSubjectsJupiterWorker from '../subject/jobs/syncSubjectsJupiterByInstitute'

const startJobs = () => {
  syncSubjectsJupiterWorker()
  syncDefaultSubjectsJupiterWorker()
  syncClassesJupiterBySubjectWorker()
}

export default startJobs
