/** @jsx h */
import { h } from "preact";

export async function action({ request }) {
  const formData = await request.formData();

  return {
    name: formData.get("name"),
  };
}

export default function Contact() {
  return (
    <article>
      <h1>Contact</h1>
      <form method="post">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
        <button>Send</button>
      </form>
    </article>
  );
}
