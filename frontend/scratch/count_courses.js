import { courses } from '../src/data/courses.ts';

console.log(`Total primary courses in dataset: ${courses.length}`);
console.log(`With ITEMS_PER_PAGE = 9, total pages = ${Math.ceil(courses.length / 9)}`);
console.log(`With ITEMS_PER_PAGE = 8, total pages = ${Math.ceil(courses.length / 8)}`);
