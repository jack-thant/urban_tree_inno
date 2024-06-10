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

export async function getUHIData()
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