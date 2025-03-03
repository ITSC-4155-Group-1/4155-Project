import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import NavBar from '../src/components/NavBar.vue';
import LoginModal from '../src/components/LoginModal.vue';
import SignupModal from '../src/components/SignupModal.vue';
import LandingPage from '../src/components/LandingPage.vue';

// mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LandingPage,
    },
  ],
})

// DESCRIBE \._./
describe('NavBar.vue', () => {
  it('opens login modal and disables scrolling', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();

    // trigger click event 
    const loginLink = wrapper.find('a.nav-link');
    await loginLink.trigger('click');
    
    // check if login modal renders
    expect(wrapper.findComponent(LoginModal).exists()).toBe(true);

    // check if scrolling is hidden
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('opens signup modal and disables scrolling', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();

    // click event (signup button is in location 1)
    const signupLink = wrapper.findAll('a.nav-link').at(1);
    await signupLink.trigger('click');
    
    // ensures the sign up modal actually shows up
    expect(wrapper.findComponent(SignupModal).exists()).toBe(true);

    // check if scrolling is hidden
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes the login modal and restores scrolling', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();

    // trigger click event 
    const loginLink = wrapper.find('a.nav-link');
    await loginLink.trigger('click');
    expect(wrapper.findComponent(LoginModal).exists()).toBe(true);

    // trigger event to close login modal
    const closeBtn = wrapper.find('.popup .close-btn');
    await closeBtn.trigger('click');

    // ensure the login modal is no longer visible
    expect(wrapper.findComponent(LoginModal).exists()).toBe(false);

    // ensure scrolling is re-enabled
    expect(document.body.style.overflow).toBe('auto');
  });

  it('closes the signup modal and restores scrolling', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();

    // trigger click event 
    const signupLink = wrapper.findAll('a.nav-link').at(1);
    await signupLink.trigger('click');
    expect(wrapper.findComponent(SignupModal).exists()).toBe(true);

    // trigger event to close sign up modal
    const closeBtn = wrapper.find('.popup .close-btn');
    console.log("found button");
    await closeBtn.trigger('click');

    // ensure the sign up modal is no longer visible
    expect(wrapper.findComponent(SignupModal).exists()).toBe(false);

    // ensure scrolling is re-enabled
    expect(document.body.style.overflow).toBe('auto');
  });
});

