// script to populate the year (2009 - 2024) and month (01 - 12)
export const years:string[] = [];
export const months:string[] = [];

const startYear = 2009;
const endYear = 2024;

const startMonth = 1;
const endMonth = 12;

for (let i = endYear; i >= startYear; i--)
{
    years.push(i.toString());
}

for (let i = startMonth; i<= endMonth; i++)
{
    if (i < 10)
    {
        months.push("0" + i.toString())
    }
    else
    {
        months.push(i.toString())
    }
}
