<h1 id="howtosendcookiestoclientswhileloginthroughgraphql"><strong>How to send cookies to clients while login, through GraphQL?</strong></h1>
<p>7th August 2022</p>
<p>Here, I am using graphql to send cookies to clients, when they send the request to the server of their credentials a particular&nbsp;<em><strong>resolver</strong></em>&nbsp;is there to handle it.</p>
<p>In a resolver there are 4 optional parameters to pass, here we are using the '<strong>CONTEXT</strong>'&nbsp;<em>{res}</em>&nbsp;to pass the response from Express to send the cookie.</p>
<p>That resolver checks:</p>
<ul>
<li><strong>Authentication</strong>: To check, if the user exists or not. If it exists then take the hashed password by getting it from the database result on querying the user. Using bcript compare the password.</li>
<li><strong>JWT</strong>: generating JWT token to store the user ID provided by the user.</li>
<li><strong>Send cookie</strong>: Here, we have to check before sending the cookie to the client, whether the password comparison passed or not, through the variable resultBcript. The cookie to be sent is generated through the cookie&nbsp;<a href="https://tusharmukherjee.vercel.app/what-is-a-cookie-and-why-it-is-used-to-store-login-credentials"><strong>method</strong></a>.</li>
</ul>
<p>Now you can send the cookie from a GraphQL resolver 🙌.</p>
<h2 id="tldr">Tl;DR</h2>
<ul>
<li>We are sending the cookie through the resolver, using the context parameter by assigning the response function to it.</li>
<li>Next, we create methods to check the credentials provided by the client.</li>
<li>Generating JWT token to store a user ID, after checking the credentials.</li>
<li>Sending the cookie through response to the client, if the comparison results to true.</li>
</ul>
<table>
<thead>
<tr>
<th>site</th>
<th><a href="https://tusharmukherjee.vercel.app/">tusharmukherjee</a></th>
</tr>
</thead>
<tbody>
<tr>
<td>github</td>
<td><a href="https://github.com/tusharmukherjee/">tusharmukherjee</a></td>
</tr>
</tbody>
</table>