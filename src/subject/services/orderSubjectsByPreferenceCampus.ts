import prisma from '../../db'
import { Subject } from '../subject.entity'

const orderSubjectsByPreferenceCampus = async (subjects: Subject[], campusId: number) => {
  const institutesByCampus = await prisma.institute.findMany({ where: { campusId } })
  const institutesIds = institutesByCampus.map((institute) => institute.id)

  const subjectsInCampus = []
  const subjectsOutOfCampus = []

  for (const subject of subjects) {
    if (institutesIds.includes(subject.instituteId!)) {
      subjectsInCampus.push(subject)
    } else {
      subjectsOutOfCampus.push(subject)
    }
  }

  return [...subjectsInCampus, ...subjectsOutOfCampus]
}

export { orderSubjectsByPreferenceCampus }
