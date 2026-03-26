import { prisma } from "@/lib/db";
import { runSingleFeed, type SourceIngestReport } from "./run-single-feed";

export type IngestRunReport = {
  sourcesAttempted: number;
  sourcesSucceeded: number;
  sourcesFailed: number;
  fetchedItems: number;
  insertedItems: number;
  skippedItems: number;
  sourceReports: SourceIngestReport[];
  errors: string[];
};

type Fetcher = typeof fetch;

export async function runAllFeeds(fetcher: Fetcher = fetch): Promise<IngestRunReport> {
  const sources = await prisma.source.findMany({
    where: { isActive: true },
    orderBy: [{ isOfficial: "desc" }, { updatedAt: "desc" }],
  });

  const report: IngestRunReport = {
    sourcesAttempted: sources.length,
    sourcesSucceeded: 0,
    sourcesFailed: 0,
    fetchedItems: 0,
    insertedItems: 0,
    skippedItems: 0,
    sourceReports: [],
    errors: [],
  };

  for (const source of sources) {
    const sourceReport = await runSingleFeed(source, prisma, fetcher);
    report.sourceReports.push(sourceReport);
    report.fetchedItems += sourceReport.fetchedItems;
    report.insertedItems += sourceReport.insertedItems;
    report.skippedItems += sourceReport.skippedItems;

    if (sourceReport.errors.length > 0) {
      report.sourcesFailed += 1;
      report.errors.push(...sourceReport.errors.map((error) => `${source.slug}: ${error}`));
    } else {
      report.sourcesSucceeded += 1;
    }
  }

  return report;
}
