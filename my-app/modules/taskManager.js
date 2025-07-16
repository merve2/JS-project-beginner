import { StorageManager } from "./storage.js";

export class TaskManager{
    constructor(){
        this.tasks=[];
        this.storageKey='gorevler';
        this.initializeElements();
        this.setupEventListeners();
        this.loadTasks();
    }
initializeElements()
{
    this.form=document.getElementById("gorevForm");
    this.input=document.getElementById("task");
    this.liste=document.getElementById("gorevListesi");
    this.onemSelect=document.getElementById("onemSelect");
this.temizleBtn=document.getElementById("gorevleriTemizle");
if (!this.form || !this.input || !this.liste || !this.onemSelect || !this.temizleBtn) {
        console.error("❌ Form elemanları doğru şekilde alınamadı!");
    }
}
setupEventListeners(){
    this.form.addEventListener("submit",(e)=> this.addTask(e));
    this.temizleBtn.addEventListener("click",()=>this.clearAllTasks());
}
addTask(e){
    e.preventDefault();
    const taskText=this.input.value.trim();
    const importance=this.onemSelect.value;
    if (taskText==="")  return;
    const newTask={
id:Date.now(),
text:taskText,
importance:importance,
completed:false
};

this.tasks.push(newTask);
this.renderTask(newTask);
this.saveTasks();
this.input.value="";

console.log("görev eklendi:",taskText);

}
renderTask(task){
    const li=document.createElement("li");
    li.textContent=`${task.text} (${task.importance})`;
    li.dataset.importance=task.importance;
    li.dataset.id=task.id; 
    if(task.completed){
        li.classList.add("tamamlandi");
    }
    li.addEventListener("click",()=>this.toggleTask(task.id));
    this.liste.appendChild(li);
}
toggleTask(taskId){
const task=this.tasks.find(t=>t.id===taskId);
if(!task) return;

task.completed=! task.completed;
const li=document.querySelector(`[data-id="${taskId}"]`);
if(li){
    li.classList.toggle("tamamlandi");
}
this.saveTasks();
console.log("görev durumu değişti:",task.text);
}
saveTasks(){
    StorageManager.save(this.storageKey,this.tasks);
}
loadTasks(){
    const savedTasks= StorageManager.load(this.storageKey);
    if(savedTasks){
        this.tasks=savedTasks;
        this.tasks.forEach(task=>this.renderTask(task));
    }
}
clearAllTasks(){
    this.tasks=[];
    this.liste.innerHTML="";
    StorageManager.remove(this.storageKey);
    console.log("tüm görevler temizlendi!");
}
}