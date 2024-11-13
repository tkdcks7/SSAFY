import { HttpStatusCode } from "axios";
import apiAuth from "../../utils/apiAuth";


interface IReadNote {
    noteId: number;
    title: string;
    progressRate: number;
    createdAt: string;
    sentence: string;
    sentenceId: string;
  }

export interface ICreateNote {
    bookId: number;
    progressRate: number; // float로 줘야할듯?
    sentence: string;
    sentenceId: string; // cfiRange
  }


// 내 책의 독서노트 조회
export const getReadNote = async (bookId: number): Promise<IReadNote | undefined> => {
return apiAuth
    .get<IReadNote>(`/notes/${bookId}`)
    .then((res) => res.data)
    .catch((err) => {
    console.log(err);
    return undefined;
    });
};

// 독서노트 생성
export const createReadNote = async (payload: ICreateNote): Promise<HttpStatusCode> => {
    return apiAuth
        .post("/notes", payload)
        .then( (res) => res.status )
        .catch((err) => { return err.status; });
    };


// 독서노트 삭제
export const deleteNote = async (noteId: number): Promise<HttpStatusCode> => {
    return apiAuth
        .delete(`/notes/${noteId}`)
        .then( (res) => res.status )
        .catch((err) => { return err.status; });
    };