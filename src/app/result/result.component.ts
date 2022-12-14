import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input('majors')
  majors!: String[];
  
  course1: Course = {name:"Calc101", course:"Calculus 1", credits:3};

  displayedColumns: string[] = ['course', 'name', 'credits'];
  vis: string[] = ['Course Name', 'Course Number', 'Number Credits'];

  items: Section[] = [];

m1: Major = {name:"Computer Engineering", sections: this.items};
m2: Major = {name:"Electrical Engineering", sections:[
        {name: 'Math', requirements:  [
          {name:"Calculus", 
          courses:[{name:"Calc221", course:"Calculus 1", credits:3}, 
                  {name:"Calc222", course:"Calculus 2", credits:3},
                  {name:"Calc223", course:"Calculus 3", credits:3}]},
          {name:"Discrete Math", 
                  courses:[{name:"CS240", course:"Discrete Math", credits:3}, ]},
          {name:"Stats Elective", 
                  courses:[{name:"Stat311", course:"Statistics for Engineers", credits:3}, ]}    
                ]}]
        }

sections: Section[] = [];
allMajors: Major[] = [];
myMajors: Major[] = [];


  expandedIndex = 0;

  panelOpenState = false;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get("../assets/majors-classes.json").subscribe((data: any) =>{
        console.log(data);
        
        this.allMajors = data.majors;

        console.log(this.allMajors);
        for (var i = 0; i < this.majors.length; i++) {
                this.myMajors = this.myMajors.concat((this.allMajors.filter(e => e.name == this.majors[i])));    
                console.log(this.myMajors);
        }
        this.combineRequirements(this.myMajors);
        console.log(this.myMajors);
        this.items = this.sections;
      })
  }

  myCourses: Course[] = [{name:"Calc221", course:"Calculus 1", credits:3},{name:"CS240", course:"Discrete Math", credits:3}, ];

  checkCourse(course: Course): Boolean {
        this.myCourses.find((course) => {
                console.log("True");
                return true;
        });
        console.log("False");
        return false;
  }

  combineRequirements(majors: Major[]) {
        for (var i = 0; i< majors.length; i++) {
                for (var j = 0; j< majors[i].sections.length; j++) {
                        if (this.sections.filter(e => e.name === majors[i].sections[j].name).length <= 0) {
                                this.sections.push(majors[i].sections[j]);  
                        } else {
                                
                                for (var k = 0; k< majors[i].sections[j].requirements.length; k++) {  
                                        if (this.sections[j].requirements.filter(e => e.name === majors[i].sections[j].requirements[k].name).length <= 0) {
                                                this.sections[j].requirements.push(majors[i].sections[j].requirements[k]);
                                        }else {
                                                for (var l = 0; l< majors[i].sections[j].requirements[k].courses.length; l++) {  
                                                        if (this.sections[j].requirements[k].courses.filter(e => e.name === majors[i].sections[j].requirements[k].courses[l].name).length <= 0) {
                                                                this.sections[j].requirements[k].courses.push(majors[i].sections[j].requirements[k].courses[l]);
                                                        }
                                                } 
                                        }
                                }
                                
                        }
                }
        }
  }

}


type Section = {
  name: string;
  requirements: Requirement[];
};

type Requirement = {
  name: string;
  courses: Course[];
};

type Course = {
  name: string;
  course: string;
  credits: number;
}

type Major = {
   name: string;
   sections: Section[];
}
