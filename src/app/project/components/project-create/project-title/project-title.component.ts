import { ProjectFormService } from './../../../services/forms/project-form.service';
import { ProjectHttpService } from './../../../services/http/project-http.service';
import { ImageUploadComponent } from './../../../../shared/components/image-upload/image-upload.component';
import { getDraftProject, getSelectedProject } from './../../../reducers/project.selector';
import { ProjectActions } from './../../../actions/project.actions';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../../core/models/project';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, wtfStartTimeRange } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit, OnDestroy {

  private projectSub$: Subscription = new Subscription();
  @Input() isEditing;
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();

  formSubmit = false;
  projectForm: FormGroup;
  categories = [{id:1, name: "Global Warming"} , {id:2, name: "Air Purification" }, {id:3, name: "Climate Change" }, {id:4, name: "Non For Profit"}];
  project: any;

  constructor(
    private actions: ProjectActions,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private projectHttpService: ProjectHttpService,
    private projectFormService: ProjectFormService
  ) {
    // this.fetchCategories();
  }

  ngOnInit() {
    console.log('editing', this.isEditing);
    if (this.isEditing) {
      this.projectSub$ = this.store.select(getSelectedProject).subscribe((project) => {
        this.initProjectForm(project);
        this.project = project;
      });
    } else {
      this.projectSub$ = this.store.select(getDraftProject).subscribe((project) => {
        this.initProjectForm(project);
        this.project = project;
      });
    }
  }

  getPictures() {
    return (<FormArray>this.projectForm.get('pictures_attributes')).value;
  }

  setImageData(image) {
    (<FormArray>this.projectForm.get('images_data')).push(
      this.fb.control(image)
    );
  }

  uploadImage() {
    this.imageUpload.showImageBrowseDlg();
  }

  removePictureAttribue(i) {
    (<FormArray>this.projectForm.get('pictures_attributes')).controls[i].patchValue({
      _destroy: true
    });
    const project = this.projectForm.value;
    if (!this.isEditing) {
      this.store.dispatch(this.actions.removeFromDraft(project));
    } else {
      this.store.dispatch(this.actions.updateProject(project));
    }
  }

  removeImageData(i) {
    (<FormArray>this.projectForm.get('images_data')).removeAt(i);
  }

  submitProject() {
   // this.setStartDate();
    this.formSubmit = true;
    const project = this.projectForm.value;
    if (this.projectForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(this.actions.saveDraft(project));
      } else {
        this.store.dispatch(this.actions.updateProject(project));
      }
    }
  }

  private setStartDate() {
    this.projectForm.controls['start_date'].setValue(this.selectedDate);
  }

  private fetchCategories() {
    this.projectHttpService.fetchAllCategories().subscribe((data) => {
      this.categories = data;
      (<FormControl>this.projectForm.controls['category_id']).setValue(data[0].id);
    });
  }

  private initProjectForm(project) {
    this.projectForm = this.projectFormService.initProjectForm(project);
    this.selectedDate = new Date(project.start_date);
  }

  ngOnDestroy() {
    this.projectSub$.unsubscribe();
  }

}
