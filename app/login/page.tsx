'use client';

import { Card, Button, Checkbox, Label, TextInput } from 'flowbite-react';

export default function Login() {
  return (
    <Card className="max-w-md">
      <p>Chichi</p>
      <form className="flex flex-col gap-8">
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email1"
              value="Your email"
            />
          </div>
          <TextInput
            id="email1"
            placeholder="name@flowbite.com"
            required
            type="email"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password1"
              value="Your password"
            />
          </div>
          <TextInput
            id="password1"
            required
            type="password"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">
            Remember me
          </Label>
        </div>
        <Button type="submit">
          Submit
        </Button>
      </form>
    </Card>
  )
}


