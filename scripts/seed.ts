import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

function iso(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function main() {
  const existing = await prisma.application.count({
    where: { school: { startsWith: "DEMO - " } },
  });
  if (existing > 0) {
    console.log("Demo applications already exist — nothing to seed.");
    return;
  }

  await prisma.application.createMany({
    data: [
      {
        school: "DEMO - ENSA Beni Mellal",
        city: "Beni Mellal",
        program: "Informatique",
        level: "Master",
        applicationDate: iso(-20),
        deadline: iso(5),
        examDate: iso(12),
        expectedResultDate: iso(25),
        status: "Waiting",
        result: "Not Published",
        officialLink: "https://www.usms.ma",
        resultsLink: "https://www.usms.ma",
        notes: "Demo row — all dates are fake.",
      },
      {
        school: "DEMO - FST Marrakech",
        city: "Marrakech",
        program: "Intelligence Artificielle",
        level: "Master",
        applicationDate: iso(-10),
        deadline: iso(1),
        examDate: iso(3),
        expectedResultDate: iso(18),
        status: "Exam",
        result: "Not Published",
        officialLink: "https://fstm.uca.ma",
        resultsLink: "https://fstm.uca.ma",
        notes: "Demo row — exam coming soon.",
      },
      {
        school: "DEMO - FS Rabat",
        city: "Rabat",
        program: "Data Science",
        level: "Master",
        applicationDate: iso(-30),
        deadline: iso(-10),
        examDate: null,
        expectedResultDate: iso(-2),
        status: "Applied",
        result: "Not Published",
        officialLink: "https://fsr.um5.ac.ma",
        resultsLink: "https://fsr.um5.ac.ma",
        notes: "Demo row — deadline already passed.",
      },
      {
        school: "DEMO - ENCG Agadir",
        city: "Agadir",
        program: "Management",
        level: "Master Spécialisé",
        applicationDate: iso(-25),
        deadline: iso(-15),
        examDate: iso(-8),
        expectedResultDate: iso(-3),
        status: "Admitted",
        result: "Admitted",
        officialLink: "https://www.ibn-zohr.ma",
        resultsLink: "https://www.ibn-zohr.ma",
        notes: "Demo row — admitted.",
      },
      {
        school: "DEMO - EMI Rabat",
        city: "Rabat",
        program: "Génie Informatique",
        level: "Concours",
        applicationDate: iso(-22),
        deadline: iso(-12),
        examDate: iso(-5),
        expectedResultDate: iso(-1),
        status: "Waiting List",
        result: "Waiting List",
        officialLink: "https://www.emi.ac.ma",
        resultsLink: "https://www.emi.ac.ma",
        notes: "Demo row — waiting list.",
      },
      {
        school: "DEMO - ENSAM Casablanca",
        city: "Casablanca",
        program: "Génie Logiciel",
        level: "Licence Professionnelle",
        applicationDate: null,
        deadline: iso(20),
        examDate: null,
        expectedResultDate: null,
        status: "To Apply",
        result: "Not Published",
        officialLink: "https://ensam-casa.ma",
        resultsLink: null,
        notes: "Demo row — not applied yet.",
      },
    ],
  });

  console.log("Seeded demo applications.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
