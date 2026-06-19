import { supabase } from "../lib/supabase"

const API_URL = "http://127.0.0.1:8000";

export async function uploadFiles(files) {

    const formData = new FormData();

    for (const file of files) {
        formData.append("files", file);
    }

    const {
        data: { session }
    } = await supabase.auth.getSession();

    const response = await fetch(
        `${API_URL}/upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.access_token}`
            },
            body: formData
        }
    );

    return response.json();
}
export async function testAuth() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    const response = await fetch(
        `${API_URL}/me`,
        {
            headers: {
                Authorization:
                    `Bearer ${session.access_token}`
            }
        }
    );

    return response.json();
}