"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { useAdminJob } from "@/hooks/useAdminJob";
import { useJobApplications } from "@/hooks/useJobApplications";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotifyEligibleStudents } from "@/hooks/useNotifyEligibleStudents";

type ApplicationTab =
  | "ALL"
  | "PENDING"
  | "SHORTLISTED"
  | "SELECTED"
  | "REJECTED";

export default function AdminJobDetailPage() {
  const statusVariant: any = {
    DRAFT: "secondary",
    OPEN: "success",
    CLOSED: "warning",
    ARCHIVED: "outline",
  } as const;

  const [activeTab, setActiveTab] = useState<ApplicationTab>("ALL");
  const [selectedFields, setSelectedFields] = useState<string[]>(["education"]);

  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();

  const { data, isLoading } = useAdminJob(jobId);
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    refetch,
  } = useJobApplications(jobId);

  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    switch (activeTab) {
      case "PENDING":
        return applications.filter((a: any) => a.status === "PENDING");

      case "SHORTLISTED":
        return applications.filter((a: any) => a.status === "SHORTLISTED");

      case "SELECTED":
        return applications.filter((a: any) => a.status === "SELECTED");

      case "REJECTED":
        return applications.filter((a: any) => a.status === "REJECTED");

      default:
        return applications;
    }
  }, [applications, activeTab]);
  //allow toggling which fields to show in excel
  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  const notifyMutation = useNotifyEligibleStudents(jobId);

  if (isLoading) return <div className="p-8">Loading…</div>;
  if (!data) return <div className="p-8 text-red-500">Job not found</div>;

  const { job, stats } = data;

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{job.role}</h1>
          <p className="text-muted-foreground">{job.company}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
          <Button onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}>
            Edit Job
          </Button>
        </div>
      </div>

      <Separator />

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
          <CardDescription>Basic job details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Info label="CTC" value={`${job.ctc} LPA`} />
          <Info
            label="Deadline"
            value={new Date(job.deadline).toLocaleDateString()}
          />
          <Info
            label="Created On"
            value={new Date(job.createdAt).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Role details and responsibilities</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company Info */}
          {job.companyInfo && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                About the Company
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.companyInfo}
              </p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Role Description
            </p>
            <p className="whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Criteria</CardTitle>
          <CardDescription>Auto-evaluated for students</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Min CGPA" value={job.eligibility.minCGPA} />
          <Info label="Min 10th Percent" value={job.eligibility.minTenth} />
          <Info label="Min 12th Percent" value={job.eligibility.minTwelfth} />
          <Info
            label="Min Diploma Percent"
            value={job.eligibility.minDiploma}
          />
          <Info label="Max Backlogs" value={job.eligibility.maxBacklogs} />
          <Info label="Passing Year" value={job.eligibility.passingYear} />
          <Info
            label="Allowed Branches"
            value={job.eligibility.allowedBranches.join(", ")}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Eligible" value={stats.eligible} />
        <Stat title="Applied" value={stats.applied} />
        <Stat title="Shortlisted" value={stats.shortlisted} />
        <Stat title="Selected" value={stats.selected} />
      </div>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Eligible Students</CardTitle>
          <CardDescription>
            Students who meet criteria but haven’t applied yet
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-3xl font-bold">{stats.eligibleNotApplied}</p>
            <p className="text-sm text-muted-foreground">
              Eligible & not applied
            </p>
          </div>

          <Button
            disabled={
              stats.eligibleNotApplied === 0 || notifyMutation.isPending
            }
            onClick={async () => {
              try {
                const res = await notifyMutation.mutateAsync();
                const { emails, subject, body } = res;

                if (!emails?.length) {
                  alert("No students to notify");
                  return;
                }

                const gmailUrl =
                  `https://mail.google.com/mail/?view=cm&fs=1` +
                  `&to=${encodeURIComponent(emails.join(","))}` +
                  `&su=${encodeURIComponent(subject)}` +
                  `&body=${encodeURIComponent(body)}`;

                window.open(gmailUrl, "_blank");
              } catch (err: any) {
                console.error("Notify error:", err?.response?.data || err);
                alert("Failed to prepare email");
              }
            }}
          >
            {notifyMutation.isPending
              ? "Preparing..."
              : "Notify Eligible Students"}
          </Button>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Students who applied for this job</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="SHORTLISTED">Shortlisted</TabsTrigger>
              <TabsTrigger value="SELECTED">Selected</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          {isApplicationsLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading applications…
            </p>
          ) : applications?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet</p>
          ) : (
            <ApplicationsTable
              applications={filteredApplications}
              onUpdated={refetch}
            />
          )}
          <Card className="mt-4 border-dashed">
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>
                Select the fields needed in Excel export. By default, only
                education details are included.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "projects",
                "internships",
                "achievements",
                "certifications",
              ].map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFields.includes(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <span className="capitalize">{field}</span>
                </div>
              ))}

              <Button
                onClick={() =>
                  window.open(
                    `/api/my-proxy/api/v1/admin/jobs/${job.id}/applications/download?fields=${selectedFields.join(",")}&status=${activeTab}`,
                    "_blank",
                  )
                }
              >
                Download Excel
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

/* helpers */

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
