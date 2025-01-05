import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FlowEditor } from "@/components/FlowEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Save, Play, Plus, X } from "lucide-react";
import { useState } from "react";

interface AgentForm {
  name: string;
  description: string;
  personality_traits: string[];
  image_url: string;
  voice_type: string;
  temperature: number;
}

export function AgentBuilder() {
  const { id } = useParams();
  const [newTrait, setNewTrait] = useState("");

  const form = useForm<AgentForm>({
    defaultValues: {
      name: "",
      description: "",
      personality_traits: [],
      image_url: "",
      voice_type: "natural",
      temperature: 70
    }
  });

  const { data: agent } = useQuery({
    queryKey: [`/api/agents/${id}`],
    enabled: !!id
  });

  const addTrait = (trait: string) => {
    if (trait.trim()) {
      const currentTraits = form.getValues("personality_traits");
      if (!currentTraits.includes(trait)) {
        form.setValue("personality_traits", [...currentTraits, trait]);
      }
      setNewTrait("");
    }
  };

  const removeTrait = (traitToRemove: string) => {
    const currentTraits = form.getValues("personality_traits");
    form.setValue(
      "personality_traits",
      currentTraits.filter(trait => trait !== traitToRemove)
    );
  };

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="mb-4">
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your agent's purpose and capabilities..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personality_traits"
                  render={() => (
                    <FormItem>
                      <FormLabel>Personality Traits</FormLabel>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTrait}
                          onChange={(e) => setNewTrait(e.target.value)}
                          placeholder="Add trait (e.g., Friendly)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTrait(newTrait);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => addTrait(newTrait)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("personality_traits").map((trait, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {trait}
                            <button
                              type="button"
                              onClick={() => removeTrait(trait)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.png" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voice_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                          <option value="natural">Natural</option>
                          <option value="friendly">Friendly</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creativity Level</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value}% - {field.value < 30 ? "More focused and consistent" : 
                          field.value < 70 ? "Balanced creativity" : "More creative and varied"}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
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