import { Person } from "./person.model";

export interface Teacher {
    teacherId: number;
    state: string;
    typeOfLinkage: string;
    departmentId: number;
    person: Partial<Person>;
}