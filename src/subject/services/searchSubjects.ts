import prisma from '../../db'

const searchSubjects = async (search: string) => {
  const subjects = (
    await prisma.subject.findMany({
      where: {
        OR: [
          {
            name: {
              contains: String(search),
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: String(search),
              mode: 'insensitive',
            },
          },
        ],
      },
      include: { subjectClass: true, institute: true },
    })
  ).filter((subject) => subject.subjectClass.length > 0)

  return subjects
}

export { searchSubjects }
