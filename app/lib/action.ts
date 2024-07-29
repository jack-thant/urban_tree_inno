import config from "@/lib/config";

export async function getTreeData() {
    const response = await fetch(`${config.apiUrl}/trees/202403`, {
        cache: 'no-store'
    });
    if (!response.ok)
    {
        throw new Error('Failed to fetch Tree Data');
    }
    return response.json();
}

export async function getUHIIslandData()
{
    const response = await fetch(`${config.apiUrl}/uhi_intensity_before_and_after`, {
        cache: 'no-store'
    });
    if (!response.ok)
    {
        throw new Error('Failed to fetch UHI Data');
    }
    return response.json();
}

export async function getUHIDistrictData(district: string)
{
    const response = await fetch(`${config.apiUrl}/${district.toUpperCase()}/uhi_intensity_before_and_after`, {
        cache: 'no-store'
    });
    if (!response.ok)
    {
        throw new Error('Failed to fetch UHI Data');
    }
    return response.json();
}

