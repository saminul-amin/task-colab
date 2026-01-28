"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon || <FileQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />}
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-md">{description}</p>
        )}
        {actionLabel && (actionHref || onAction) && (
          <>
            {actionHref ? (
              <Button asChild className="mt-6">
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button className="mt-6" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
