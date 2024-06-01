import { ConflictError, UnauthorizedError } from "../error/httpError";


const todoLink = "api/todos/";
const userLink= "api/users/";

async function fetchData(input:RequestInfo,init?:RequestInit) {
    const res= await fetch(input,init);

    if(res.ok) return res;
    else{
        const errorBody = await res.json();
        const errormessage= errorBody.error;

        if (res.status===401) throw new UnauthorizedError(errormessage)
        else if(res.status===409) throw new ConflictError(errormessage)
        else throw Error("request failed with status: " + res.status + " message "+ errormessage);
    }
}