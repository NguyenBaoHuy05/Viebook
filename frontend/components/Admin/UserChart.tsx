"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import axios from "@/lib/axiosConfig";
import { useEffect, useState, useMemo } from "react";

interface DailyUserData {
  date: string;
  users: number;
}

// Cấu hình này định nghĩa các data key và label cho biểu đồ và tooltip
const chartConfig = {
  users: {
    label: "Số lượng thành viên: ",
    color: "hsl(var(--chart-1))",
  },
  count: {
    label: "Số lượng",
  },
} satisfies ChartConfig;

export default function UserStatisticsChart() {
  const [dailyUserData, setDailyUserData] = useState<DailyUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/admin/stats/users-daily?last_days=7");

        if (Array.isArray(res.data)) {
          setDailyUserData(res.data);
          console.log("Dữ liệu User:", res.data);
        } else {
          console.error("Unexpected data structure:", res.data);
          setError("Dữ liệu thống kê không đúng định dạng.");
          setDailyUserData([]);
        }
      } catch (err) {
        console.error("Error fetching daily user stats:", err);
        setError("Không thể tải dữ liệu thống kê bài viết.");
        setDailyUserData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const totalUsers = useMemo(() => {
    return dailyUserData.reduce((acc, curr) => acc + curr.users, 0);
  }, [dailyUserData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê user</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">Đang tải dữ liệu thống kê...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê user</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-destructive">{error}</p>{" "}
        </CardContent>
      </Card>
    );
  }

  if (!dailyUserData || dailyUserData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê user</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">
            Không có dữ liệu thống kê user.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-200">
      {/* 👇 Cập nhật Card Header 👇 */}
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Thống kê user theo ngày</CardTitle>
          <CardDescription>
            Hiển thị số lượng user được tạo 7 ngày gần nhất
          </CardDescription>
        </div>
      </CardHeader>

      {/* 👇 Cập nhật Card Content chứa biểu đồ 👇 */}
      <CardContent className="px-2 sm:p-6 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full" // Điều chỉnh chiều cao biểu đồ nếu cần
        >
          {/* 👇 BarChart 👇 */}
          <BarChart
            accessibilityLayer
            data={dailyUserData}
            margin={{
              left: 12,
              right: 12,
              top: 12, // Thêm margin trên cho trục Y
              bottom: 0, // Giảm margin dưới nếu cần
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            {/* Trục X (ngày tháng) */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="users"
                  formatter={(value, name) => {
                    const numericValue = value as number;
                    const stringName = name as string;
                    return [
                      chartConfig[stringName as keyof typeof chartConfig]
                        ?.label,
                      ` ${numericValue.toLocaleString()} user. `,
                    ];
                  }}
                  // Định dạng hiển thị ngày trong header của tooltip
                  labelFormatter={(value: string) => {
                    const date = new Date(value);

                    return date.toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="users" fill={chartConfig.users.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
