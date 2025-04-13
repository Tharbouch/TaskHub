import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch } from "@/stores/store";
import { Project, ProjectFormData } from "@/types/project";
import { createProject, updateProject } from "@/stores/slices/projectsSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
});

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project; // Optional for edit mode
  mode: "create" | "edit";
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
  mode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = mode === "edit";

  console.log("ProjectDialog rendering with project:", project);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
    },
  });

  // Important: Reset form values when project or open state changes
  useEffect(() => {
    console.log("Effect triggered - project:", project);
    if (project && isEditMode) {
      console.log("Resetting form with:", project.name, project.description);
      form.reset({
        name: project.name,
        description: project.description,
      });
    } else if (!isEditMode) {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [project, isEditMode, open, form]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditMode && project) {
        await dispatch(
          updateProject({
            id: project.id,
            ...data,
          })
        ).unwrap();
      } else {
        await dispatch(createProject(data)).unwrap();
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} project:`,
        error
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit" : "Create New"} Project
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 space-x-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-md"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button className="rounded-md" type="submit">
                {isEditMode ? "Update" : "Create"} Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
