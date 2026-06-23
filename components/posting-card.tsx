"use client";

import { motion } from "motion/react";
import { Posting } from "@/lib/types";
import { Calendar, Building, IndianRupee, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PostingCardProps {
  posting: Posting;
  index: number;
  onViewDetails: (posting: Posting) => void;
}

export function PostingCard({
  posting,
  index,
  onViewDetails,
}: PostingCardProps) {
  const deadlineDate = new Date(posting.deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    posting.status === "OPEN" && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-primary">
                  {posting.role}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-base font-medium">
                  <Building className="w-4 h-4" />
                  {posting.company}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="font-semibold shrink-0 max-w-[45%] whitespace-normal text-right"
              >
                {posting.ctc} LPA
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {posting.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary/70" />
                <span className="truncate" title={posting.companyInfo}>
                  {posting.companyInfo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span>Deadline: {deadlineDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full font-semibold group"
              onClick={() => onViewDetails(posting)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  );
}
