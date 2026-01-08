'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function KeywordPerformance({ keywords }: { keywords: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Performance (Sample)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Match Type</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">CTR (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((kw, i) => (
              <TableRow key={i}>
                <TableCell>{kw.keyword}</TableCell>
                <TableCell>{kw.matchType}</TableCell>
                <TableCell className="text-right">{Math.floor(Math.random() * 1000)}</TableCell>
                <TableCell className="text-right">{Math.floor(Math.random() * 20000)}</TableCell>
                <TableCell className="text-right">{(Math.random() * 8).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
