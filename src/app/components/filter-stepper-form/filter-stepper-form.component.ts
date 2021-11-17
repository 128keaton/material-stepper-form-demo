import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-filter-stepper-form',
  templateUrl: './filter-stepper-form.component.html',
  styleUrls: ['./filter-stepper-form.component.scss']
})
export class FilterStepperFormComponent implements OnInit {

  @ViewChild('facetInput') facetInput!: ElementRef<HTMLInputElement>;

  facetSelectionGroup!: FormGroup;
  genderAgeFormGroup!: FormGroup;

  selectFacetFormControl = new FormControl('', Validators.required);
  ageGroupFormControl = new FormControl('', Validators.required);
  facetDataControl = new FormControl();

  facetOptions = [
    'ZIP Code',
    'Tract'
  ];

  ageGroupOptions = [
    '0 - 5',
    '6 - 10',
    '11 - 17'
  ];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedFacetData: string[] = [];
  filteredFacetData: Observable<string[]>;
  facetData: string[] = [];
  inputPlaceholder = 'None';

  zipCodes = [
    '38119',
    '38117',
    '38104'
  ];

  tracts = [
    '123123123',
    '125234125',
    '694835812'
  ];


  constructor(private formBuilder: FormBuilder) {

    this.filteredFacetData = this.facetDataControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => value ? this._filter(value) : this.facetData.slice()),
    );

    this.selectFacetFormControl.valueChanges.subscribe(value => {
      if (value === 'ZIP Code') {
        this.facetData = this.zipCodes;
        this.inputPlaceholder = value;
      } else if (value === 'Tract') {
        this.facetData = this.tracts;
        this.inputPlaceholder = value;
      } else {
        this.facetData = [];
        this.inputPlaceholder = 'None';
      }

      this.facetDataControl.setValue(null);
      this.selectedFacetData = [];
    })
  }

  ngOnInit(): void {
    this.facetSelectionGroup = this.formBuilder.group({
      selectFacetFormControl: this.selectFacetFormControl
    });
    this.genderAgeFormGroup = this.formBuilder.group({
      male: ['', Validators.required],
      female: ['', Validators.required],
      both: ['', Validators.required],
      ageGroupFormControl: this.ageGroupFormControl
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedFacetData.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.facetDataControl.setValue(null);
  }

  remove(value: string): void {
    const index = this.selectedFacetData.indexOf(value);

    if (index >= 0) {
      this.selectedFacetData.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedFacetData.push(event.option.viewValue);
    this.facetInput.nativeElement.value = '';
    this.facetDataControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.facetData.filter(v => v.toLowerCase().includes(filterValue));
  }
}
