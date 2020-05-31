/*
 * The contents of this file are licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 *
 */

(function () {

  "use strict";

  /* global $: false */
  /* global SieveDesigner */
  /* global SieveActionDialogBoxUI */
  /* global SieveStringListWidget */
  /* global SieveMatchTypeWidget */
  /* global SieveComparatorWidget */
  /* global SieveTemplate */

  /**
   * Provides a UI for th add header action
   */
  class SieveAddHeaderUI extends SieveActionDialogBoxUI {

    /**
     * Gets the header name
     *
     * @returns {SieveAbstractString}
     *   the element's header field name
     */
    name() {
      return this.getSieve().getElement("name");
    }

    /**
     * Gets the header value
     *
     * @returns {SieveAbstractString}
     *   the element's header value field
     */
    value() {
      return this.getSieve().getElement("value");
    }

    /**
     *
     * @param {*} id
     * @param {*} status
     */
    enable(id, status) {
      return this.getSieve().enable(id, status);
    }

    /**
     * @inheritdoc
     */
    getTemplate() {
      return "./editheader/templates/SieveAddHeaderActionUI.html";
    }

    /**
     * @inheritdoc
     */
    onSave() {

      const name = document.querySelector("#sivNewHeaderName");

      if (!name.checkValidity())
        return false;

      const value = document.querySelector("#sivNewHeaderValue");

      if (!value.checkValidity())
        return false;

      this.name().value(name.value);
      this.value().value(value.value);

      this.enable("last",
        document.querySelector("input[type='radio'][name='last']:checked").value === "true");

      return true;
    }

    /**
     * @inheritdoc
     */
    onLoad() {

      document.querySelector("#sivNewHeaderName").value = this.name().value();
      document.querySelector("#sivNewHeaderValue").value = this.value().value();

      document
        .querySelector(`input[type="radio"][name="last"][value="${this.enable("last")}"]`)
        .checked = true;
    }

    /**
     * @inheritdoc
     */
    getSummary() {
      const FRAGMENT =
        `<div>
           <span data-i18n="addheader.summary1"></span>
           <em class="sivAddheaderName"></em>
           <span data-i18n="addheader.summary2"></span>
           <em class="sivAddheaderValue"></em>
         </div>`;

      const elm = (new SieveTemplate()).convert(FRAGMENT);
      elm.querySelector(".sivAddheaderName").textContent
        = this.name().value();
      elm.querySelector(".sivAddheaderValue").textContent
        = this.value().value();

      return elm;
    }
  }


  /**
   * Provides an UI for thee Delete Header action
   */
  class SieveDeleteHeaderUI extends SieveActionDialogBoxUI {

    /**
     * Gets the match type.
     *
     * @returns {SieveAbstractElement}
     *   the element's match type
     */
    matchtype() {
      return this.getSieve().getElement("match-type");
    }

    /**
     * Gets the comparator type.
     *
     * @returns {SieveAbstractElement}
     *   the element's comparator type
     */
    comparator() {
      return this.getSieve().getElement("comparator");
    }

    /**
     * Gets the header name
     *
     * @returns {SieveAbstractString}
     *   the element's header field name
     */
    name() {
      return this.getSieve().getElement("name");
    }

    /**
     * The optional value patterns
     * @returns {SieveStringList}
     *   a string list containing the patterns.
     */
    values() {
      return this.getSieve().getElement("values");
    }

    /**
     * @inheritdoc
     */
    getTemplate() {
      return "./editheader/templates/SieveDeleteHeaderActionUI.html";
    }

    /**
     * Saves the current header index.
     *
     */
    saveHeaderIndex() {
      const indexType = document
        .querySelector('input[type="radio"][name="header-index"]:checked').value;

      switch (indexType) {
        case "first":
          this.getSieve().enable("index", true);
          this.getSieve().getElement("index").enable("last", false);


          this.getSieve().getElement("index").getElement("name")
            .setValue(document.querySelector("#sivDeleteHeaderFirstIndex").value);

          break;

        case "last":
          this.getSieve().enable("index", true);
          this.getSieve().getElement("index").enable("last", true);

          this.getSieve().getElement("index").getElement("name")
            .setValue(document.querySelector("#sivDeleteHeaderLastIndex").value);
          break;

        default:
          this.getSieve().enable("index", false);
          this.getSieve().getElement("index").enable("last", false);
          break;
      }
    }

    /**
     * Saves the current header values
     *
     */
    saveHeaderValues() {
      const value = document
        .querySelector(`input[type="radio"][name='header-value']:checked`).value;

      switch (value) {
        case "some":
          this.getSieve().enable("values", true);
          break;

        case "any":
        default:
          this.getSieve().enable("values", false);
          break;
      }
    }

    /**
     * @inheritdoc
     */
    onSave() {

      const name = document.querySelector("#sivDeleteHeaderName");

      if (!name.checkValidity())
        return false;

      (new SieveMatchTypeWidget("#sivDeleteHeaderMatchTypes"))
        .save(this.matchtype());
      (new SieveComparatorWidget("#sivDeleteHeaderComparator"))
        .save(this.comparator());

      (new SieveStringListWidget("#sivValuePatternsList"))
        .save(this.values());

      this.getSieve().getElement("name").value(name.value);

      this.saveHeaderIndex();
      this.saveHeaderValues();


      return true;
    }

    /**
     * Initializes the header index elements
     */
    loadHeaderIndex() {

      $('input[type="radio"][name="header-index"][value="all"]').change(() => {
        $("#sivDeleteHeaderFirstIndex").prop("disabled", true);
        $("#sivDeleteHeaderLastIndex").prop("disabled", true);
      });

      $('input[type="radio"][name="header-index"][value="first"]').change(() => {
        $("#sivDeleteHeaderFirstIndex").prop("disabled", false);
        $("#sivDeleteHeaderLastIndex").prop("disabled", true);
      });

      $('input[type="radio"][name="header-index"][value="last"]').change(() => {
        $("#sivDeleteHeaderFirstIndex").prop("disabled", true);
        $("#sivDeleteHeaderLastIndex").prop("disabled", false);
      });

      let indexType = "all";
      const indexValue = this.getSieve().getElement("index").getElement("name").getValue();

      if (!this.getSieve().enable("index")) {
        indexType = "all";
      }
      else if (!this.getSieve().getElement("index").enable("last")) {
        indexType = "first";
        document.querySelector("#sivDeleteHeaderFirstIndex").value = indexValue;
      }
      else {
        indexType = "last";
        document.querySelector("#sivDeleteHeaderLastIndex").value = indexValue;
      }

      $('input[type="radio"][name="header-index"][value="' + indexType + '"]')
        .prop('checked', true)
        .change();

    }

    /**
     * Initializes the ui for the header values
     */
    loadHeaderValues() {
      $('input[type="radio"][name="header-value"][value="any"]').change(() => {
        document.querySelector('#sivSomeValues').style.display = "none";
      });

      $('input[type="radio"][name="header-value"][value="some"]').change(() => {
        document.querySelector('#sivSomeValues').style.display = "";
      });


      let headerType = "any";
      if (!this.getSieve().enable("values")) {
        headerType = "any";
      } else {
        headerType = "some";
      }

      $('input[type="radio"][name="header-value"][value="' + headerType + '"]')
        .prop('checked', true)
        .change();
    }

    /**
     * @inheritdoc
     */
    onLoad() {

      (new SieveMatchTypeWidget("#sivDeleteHeaderMatchTypes"))
        .init(this.matchtype());
      (new SieveComparatorWidget("#sivDeleteHeaderComparator"))
        .init(this.comparator());

      (new SieveStringListWidget("#sivValuePatternsList"))
        .init(this.values());


      document.querySelector("#sivDeleteHeaderName")
        .value = this.getSieve().getElement("name").value();

      this.loadHeaderValues();
      this.loadHeaderIndex();
    }

    /**
     * @inheritdoc
     */
    getSummary() {
      const FRAGMENT =
        `<div>
           <span data-i18n="deleteheader.summary1"></span>
           <em class="sivDeleteheaderName"></em>
           <span class="sivDeleteheaderHasValue">
             <span data-i18n="deleteheader.summary2"></span>
             <em class="sivDeleteheaderValue"></em>
           </span>
         </div>`;

      const elm = (new SieveTemplate()).convert(FRAGMENT);
      elm.querySelector(".sivDeleteheaderName").textContent
        = this.name().value();

      if (!this.getSieve().enable("values")) {
        elm.querySelector(".sivDeleteheaderHasValue").style.display = "none";
        return elm;
      }

      elm.querySelector(".sivDeleteheaderValue").textContent
        = this.values().toScript();

      return elm;
    }
  }

  if (!SieveDesigner)
    throw new Error("Could not register add header Widgets");

  SieveDesigner.register("action/addheader", SieveAddHeaderUI);
  SieveDesigner.register("action/deleteheader", SieveDeleteHeaderUI);
})(window);
