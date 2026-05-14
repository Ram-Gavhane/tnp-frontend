"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  applications: any[];
  onUpdated?: () => void;
  className?: string;
};

export function ApplicationsTable({
  applications,
  onUpdated,
  className,
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");

  // ... (keep existing state and logic)

  const hasSelection = selected.length > 0;

  const allSelected = useMemo(
    () => applications.length > 0 && selected.length === applications.length,
    [selected, applications],
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelected(allSelected ? [] : applications.map((a) => a.id));
  };

  const handleBulkUpdate = async () => {
    if (!status || selected.length === 0) return;

    try {
      setIsUpdating(true);

      await axios.patch("/api/my-proxy/api/v1/admin/applications/status", {
        applicationIds: selected,
        status,
      });

      toast.success(`Updated ${selected.length} applications`);

      setSelected([]);
      setStatus("");

      onUpdated?.();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update applications");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`overflow-hidden ${className ? className : "rounded-lg border"}`}
    >
      {/* Bulk action bar */}
      {hasSelection && (
        <div className="flex items-center gap-4 p-4 border-b bg-muted">
          <p className="text-sm font-medium">{selected.length} selected</p>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Change application status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="SELECTED">Selected</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button disabled={!status || isUpdating} onClick={handleBulkUpdate}>
            {isUpdating ? "Updating…" : "Update Status"}
          </Button>
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        <Table className="min-w-[1000px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox checked={allSelected} onCheckedChange={selectAll} />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>10th %</TableHead>
              <TableHead>12th %</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.map((app) => {
              const isFinal = app.status === "SELECTED";

              return (
                <TableRow key={app.id}>
                  <TableCell>
                    <Checkbox
                      disabled={isFinal}
                      checked={selected.includes(app.id)}
                      onCheckedChange={() => toggle(app.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">
                      {app.student.firstName} {app.student.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.student.user.email}
                    </div>
                  </TableCell>

                  <TableCell>{app.score ?? "—"}%</TableCell>

                  <TableCell>{app.student.education?.branch ?? "—"}</TableCell>

                  <TableCell>{app.student.education?.cgpa ?? "—"}</TableCell>

                  <TableCell>
                    {app.student.education?.tenthPercent ?? "—"}
                  </TableCell>

                  <TableCell>
                    {app.student.education?.twelfthPercent ?? "—"}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{app.status}</Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}

            {applications.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  No applications yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
