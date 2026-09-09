function useDateFilters(dateParam: { from?: string; to?: string; }) {
  const dateOptions = [
    {
      name: "Yesterday",
      value: "yesterday",
      range() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        return {
          from: yesterday.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        }
      }
    },
    {
      name: "Last Week",
      value: "last_week",
      range() {
        const now = new Date();
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);

        return {
          from: lastWeek.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Last Month",
      value: "last_month",
      range() {
        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        return {
          from: lastMonth.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Last Year",
      value: "last_year",
      range() {
        const now = new Date();
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);

        return {
          from: lastYear.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Custom Range",
      value: "custom_range",
      range() {
        return {
          from: dateParam.from ?? "",
          to: dateParam.to ?? ""
        }
      }
    }
  ];

  function getDateFilterValue(date: { from: string; to: string; }) {
    return dateOptions.find(filter => {
      const range = filter.range();

      return range.from === date.from &&
        range.to === date.to;
    })?.value || "custom_range"
  }

  return {
    dateOptions,
    getDateFilterValue,
  }
}

export { useDateFilters };