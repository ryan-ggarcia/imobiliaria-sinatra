import toast from "react-hot-toast";
export class ApiClient {

    static baseUrl = "http://localhost:5000"

    static headers = { "Content-Type": "application/json" }

    static async get(endpoint) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "GET",
            headers: this.headers,
            credentials: 'include',
        })

        return await this.checarResposta(response);
    }

    static async post(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "POST",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    static async put(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "PUT",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    static async delete(endpoint) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "DELETE",
            credentials: 'include',
            headers: this.headers
        })

        return await this.checarResposta(response);
    }

    static async patch(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "PATCH",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    static async postFormData(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "POST",
            credentials: 'include',
            body: body
        })

        return await this.checarResposta(response);
    }

    static async checarResposta(response) {
        // 204 não tem corpo: response.json() quebraria
        if(response.status === 204) {
            return null;
        }

        if(response.ok) {
            const json = await response.json();
            return json;
        }
        else{
            let resposta = await response.json();
            console.log(`Erro ao realizar requisição! HTTP Status: ${response.status}`)
            if(response.status != 401) {
                if(resposta.msg) {
                    toast.error(resposta.msg);
                }
                else{
                    toast.error(`Erro ao realizar requisição! HTTP Status: ${response.status}`);
                }
            }
        }
    }
}