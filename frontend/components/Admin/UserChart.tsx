"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState, useEffect, useMemo } from "react";
import React from "react";
import axios from "@/lib/axiosConfig";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingPage from "../Modal/LoadingPage";
interface DailyUserData {
  date: string;
  users: number;
}

const chartConfig = {
  users: {
    label: "User",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function DailyStatsChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [dailyUserData, setDailyUserData] = useState<DailyUserData[] | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<DailyUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDailyCounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "/api/admin/stats/users-daily?last_days=90"
        );
        if (Array.isArray(res.data)) {
          const dataAsNumbers = res.data.map((item) => ({
            ...item,
            users: Number(item.users),
          }));
          setDailyUserData(dataAsNumbers);
        } else {
          console.error("Unexpected data structure:", res.data);
          setError("Dữ liệu thống kê không đúng định dạng.");
          setDailyUserData(null);
        }
      } catch (err) {
        // Xử lý lỗi fetch API
        console.error("Error fetching daily counts:", err);
        setError("Không thể tải dữ liệu thống kê.");
        setDailyUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCounts();
  }, []);
  useEffect(() => {
    if (!dailyUserData || dailyUserData.length === 0) {
      setFilteredData([]);
      return;
    }
    const latestDateInFetchedData = new Date(
      dailyUserData[dailyUserData.length - 1].date
    );

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(latestDateInFetchedData);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setHours(0, 0, 0, 0);
    const data = dailyUserData.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= startDate;
    });

    setFilteredData(data);
  }, [dailyUserData, timeRange]);
  if (
    isLoading ||
    !dailyUserData ||
    (dailyUserData.length > 0 && (!filteredData || filteredData.length === 0))
  ) {
    let message = "Đang tải dữ liệu...";
    if (
      !isLoading &&
      !error &&
      dailyUserData &&
      dailyUserData.length > 0 &&
      (!filteredData || filteredData.length === 0)
    ) {
      message = "Không có dữ liệu trong khoảng thời gian đã chọn.";
    }
    if (error) {
      message = error;
    }
    if (
      !isLoading &&
      !error &&
      (!dailyUserData || dailyUserData.length === 0)
    ) {
      message = "Không có dữ liệu thống kê.";
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Thống kê hàng ngày</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p
            className={
              error ? "text-destructive" : "text-muted-foreground text-center"
            }
          >
            {message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {isLoading && <LoadingPage isError={isLoading} />}
      <Card className="w-300 text-white bg-gray-900">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-base sm:text-xl">
              Thống kê hàng ngày số lượng user
            </CardTitle>{" "}
            <CardDescription className="text-sm">
              Hiển thị số lượng user
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Chọn khoảng thời gian"
            >
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">3 tháng gần nhất</SelectItem>
              <SelectItem value="30d">30 ngày gần nhất</SelectItem>
              <SelectItem value="7d">7 ngày gần nhất</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 ">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] w-full "
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
                stroke="hsl(var(--muted-foreground))"
              />
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
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[150px] text-black"
                    formatter={(
                      value: string | number | undefined,
                      name: string
                    ) => {
                      const label =
                        chartConfig[name as keyof typeof chartConfig]?.label ||
                        name;

                      const formattedValue =
                        typeof value === "number"
                          ? value.toLocaleString()
                          : value || "0";

                      return [label, `: ${formattedValue} user`];
                    }}
                    labelFormatter={(value: string) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                    indicator="dot" // Sử dụng chấm tròn làm indicator trên Area Chart
                  />
                }
              />
              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                stroke="hsl(var(--chart-1))"
                stackId="a"
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--chart-1))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
              {/* Legend hiển thị chú giải màu */}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
