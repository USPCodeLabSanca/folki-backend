import { Subject } from '../subject.entity'

const orderSubjectsByPreferenceInstitute = async (subjects: Subject[], instituteId: number) => {
  const subjectsInInstitute = []
  const subjectsOutOfInstitute = []

  for (const subject of subjects) {
    if (subject.instituteId === instituteId) {
      subjectsInInstitute.push(subject)
    } else {
      subjectsOutOfInstitute.push(subject)
    }
  }

  return [...subjectsInInstitute, ...subjectsOutOfInstitute]
}

export { orderSubjectsByPreferenceInstitute }
