<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* emails/request_status.html.twig */
class __TwigTemplate_ac64024b98eaf6559edf69b6f187a2ee extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "emails/request_status.html.twig"));

        // line 1
        yield "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Mise à jour de votre demande</title>
</head>
<body>
    <h1>Mise à jour de votre demande #";
        // line 8
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 8, $this->source); })()), "id", [], "any", false, false, false, 8), "html", null, true);
        yield "</h1>
    <p>Bonjour ";
        // line 9
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["user"]) || array_key_exists("user", $context) ? $context["user"] : (function () { throw new RuntimeError('Variable "user" does not exist.', 9, $this->source); })()), "nom", [], "any", false, false, false, 9), "html", null, true);
        yield ",</p>
    <p>Votre demande de matériel #";
        // line 10
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 10, $this->source); })()), "id", [], "any", false, false, false, 10), "html", null, true);
        yield " a été <strong>";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 10, $this->source); })()), "statut", [], "any", false, false, false, 10), "html", null, true);
        yield "</strong>.</p>
    
    ";
        // line 12
        if ((CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 12, $this->source); })()), "statut", [], "any", false, false, false, 12) == "approuvée")) {
            // line 13
            yield "        <p>Les matériels suivants vous ont été accordés :</p>
        <ul>
            ";
            // line 15
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 15, $this->source); })()), "demandeMateriels", [], "any", false, false, false, 15));
            foreach ($context['_seq'] as $context["_key"] => $context["item"]) {
                // line 16
                yield "                <li>";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, $context["item"], "materiel", [], "any", false, false, false, 16), "nom", [], "any", false, false, false, 16), "html", null, true);
                yield " (Quantité accordée : ";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["item"], "quantiteAccordee", [], "any", false, false, false, 16), "html", null, true);
                yield ")</li>
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_key'], $context['item'], $context['_parent']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 18
            yield "        </ul>
    ";
        }
        // line 20
        yield "
    ";
        // line 21
        if ((($tmp = CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 21, $this->source); })()), "commentaireApprobation", [], "any", false, false, false, 21)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 22
            yield "        <p><strong>Commentaire :</strong> ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 22, $this->source); })()), "commentaireApprobation", [], "any", false, false, false, 22), "html", null, true);
            yield "</p>
    ";
        }
        // line 24
        yield "
    <p>Cordialement,<br>Système de Gestion d'Inventaire</p>
</body>
</html>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "emails/request_status.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  105 => 24,  99 => 22,  97 => 21,  94 => 20,  90 => 18,  79 => 16,  75 => 15,  71 => 13,  69 => 12,  62 => 10,  58 => 9,  54 => 8,  45 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Mise à jour de votre demande</title>
</head>
<body>
    <h1>Mise à jour de votre demande #{{ demande.id }}</h1>
    <p>Bonjour {{ user.nom }},</p>
    <p>Votre demande de matériel #{{ demande.id }} a été <strong>{{ demande.statut }}</strong>.</p>
    
    {% if demande.statut == 'approuvée' %}
        <p>Les matériels suivants vous ont été accordés :</p>
        <ul>
            {% for item in demande.demandeMateriels %}
                <li>{{ item.materiel.nom }} (Quantité accordée : {{ item.quantiteAccordee }})</li>
            {% endfor %}
        </ul>
    {% endif %}

    {% if demande.commentaireApprobation %}
        <p><strong>Commentaire :</strong> {{ demande.commentaireApprobation }}</p>
    {% endif %}

    <p>Cordialement,<br>Système de Gestion d'Inventaire</p>
</body>
</html>
", "emails/request_status.html.twig", "C:\\Users\\ANFAR-Tech\\.gemini\\antigravity\\scratch\\inventory_api\\templates\\emails\\request_status.html.twig");
    }
}
