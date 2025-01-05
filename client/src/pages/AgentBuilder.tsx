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
  const [traitInputs, setTraitInputs] = useState<string[]>(['']); // Array to hold multiple trait inputs

  const form = useForm<AgentForm>({
    defaultValues: {
      name: "",
      description: "",
      personality_traits: [],
      image_url: "",
      voice_type: "male", //default to male
      temperature: 70
    }
  });

  const { data: agent } = useQuery({
    queryKey: [`/api/agents/${id}`],
    enabled: !!id
  });

  const addTraitInput = () => {
    setTraitInputs([...traitInputs, '']);
  };

  const updateTraitInput = (index: number, value: string) => {
    const newInputs = [...traitInputs];
    newInputs[index] = value;
    setTraitInputs(newInputs);
  };

  const addTrait = (trait: string, index: number) => {
    if (trait.trim()) {
      const currentTraits = form.getValues("personality_traits");
      if (!currentTraits.includes(trait)) {
        form.setValue("personality_traits", [...currentTraits, trait]);
        // Clear the input after adding
        const newInputs = [...traitInputs];
        newInputs[index] = '';
        setTraitInputs(newInputs);
      }
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
                      <div className="space-y-2">
                        {traitInputs.map((trait, index) => (
                          <div key={index}>
                            <Input
                              value={trait}
                              onChange={(e) => updateTraitInput(index, e.target.value)}
                              placeholder="Add trait (e.g., Friendly)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTrait(trait, index);
                                }
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTraitInput}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Trait
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
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
                          className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="robot">Robot</option>
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