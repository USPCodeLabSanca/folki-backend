import SubjectClass from './SubjectClass'

interface Activity {
  id: number
  name: string
  finishDate: Date
  subjectClassId: number
  subjectClass?: SubjectClass
  type: string
  isPrivate: boolean
}

export default Activity
