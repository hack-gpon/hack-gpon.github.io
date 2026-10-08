# Usage

{% if include.alertUsage %}
::: info Note
{{ include.alertUsage }}
:::
{% endif %}


{% unless include.disableEnablePassword == true %}
## Login and enable

{% if include.alertEnablePassword %}
::: info Note
{{ include.alertEnablePassword }}
:::
{% endif %}

Once you're logged in, a custom menu will be shown and you'll be able to access the linux shell by first typing `system` followed by `shell`:

```sh
ONT>enable
#ONT>login
User name:{{include.username}}
Password: ****
```

The enable password can be generated using the following form:

<CigPassword username="{{ include.username }}" />

{% endunless %}

# Accessing Full Shell

To access a complete linux shell just type:
```sh
#ONT>system
#ONT/system>shell
```

To exit the shell and reach the parent menu type `exit` or `x`, in each menu the `help` command will show how to use the shell
