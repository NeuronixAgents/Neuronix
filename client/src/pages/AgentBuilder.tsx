import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FlowEditor } from "@/components/FlowEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Save, Play } from "lucide-react";

export function AgentBuilder() {
  const { id } = useParams();
  const form = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const { data: agent } = useQuery({
    queryKey: [`/api/agents/${id}`],
    enabled: !!id
  });

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <Form {...form}>
          <form className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My AI Agent" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-4 w-4" />
                Test
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Card className="flex-1 p-4 bg-background/50">
        <FlowEditor />
      </Card>
    </div>
  );
}
