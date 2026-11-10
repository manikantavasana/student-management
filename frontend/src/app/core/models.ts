export interface CourseSummary {
  id: number;
  code: string;
  title: string;
}

export interface Course extends CourseSummary {
  description: string | null;
}

export interface CoursePayload {
  code: string;
  title: string;
  description: string | null;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  courses: CourseSummary[];
}

export interface StudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  courseIds: number[];
}
