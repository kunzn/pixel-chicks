import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  done: boolean = false;
  major: String = "";
  classes: string[] = ["Calc 211", "Calc 222", "Math 240"];

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;

  constructor(private _formBuilder: FormBuilder, private httpClient: HttpClient) {
  }

  myControl = new FormControl('');
  myControl2 = new FormControl('');
  options: string[] =  [];
  filteredOptions: Observable<string[]> | undefined;
  filteredClasses: Observable<string[]> | undefined;
  majors: String[] = [];

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredClasses = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value || '')),
    );
      this.httpClient.get("../assets/majors.json").subscribe((data: any) =>{
        console.log(data);
        
        this.options = data.majors;
      })
  }

  toggleDone() {
    this.done = !this.done;
  }

  majorCtrl = new FormControl('');


  remove(major: String): void {
    const index = this.majors.indexOf(major);

    if (index >= 0) {
      this.majors.splice(index, 1);
    }
  }

  @ViewChild('majorInput') majorInput: ElementRef<HTMLInputElement> | any;

  makeChip(value: string) {
    console.log("here");
    this.majors.push(this.major);
    this.majorInput = "";
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    console.log(this.filteredClasses);

    return this.classes.filter(option => option.toLowerCase().includes(filterValue));
  }
}

type Course = {
  name: string;
  course: string;
  credits: number;
}