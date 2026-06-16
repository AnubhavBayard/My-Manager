const API_URL = "http://127.0.0.1:8000";

export async function uploadFiles(files) {

    const formData = new FormData();

    for (const file of files) {
        formData.append("files", file);
    }

    const response = await fetch(
        `${API_URL}/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    return response.json();
}

